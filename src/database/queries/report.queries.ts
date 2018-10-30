import { Client } from "pg";
import { LOG_ACCESS, LOG_CALL, LOG_CONFERENCE } from "../tables/config";
import { errorGenerator } from "../../components/error";
import { postgreeDateFormat } from "../utils/postgree";

export class ReportQueries {

  client: Client;

  constructor(client: Client){
    this.client = client;
  }

  async getByFilter(filter: any) {
    
    const { fields } = LOG_ACCESS;
    let where = " WHERE ";
    let and = " AND ";
    let or = " OR "

    let logAccessFilter = "";
    let logCallFilter = "";
    let logConferenceFilter = "";

    let userLogAccessFilter = "";
    let userLogCallFilter = "";
    let userLogConferenceFilter = "";

    if (Object.keys(filter).length > 0) {
      logAccessFilter = where;
      logCallFilter = where;
      logConferenceFilter = where;

      if (filter.start && filter.end) {
        logAccessFilter += ` 
        ${fields.createdAt.value} >= '${ postgreeDateFormat(filter.start) }' 
        AND ${fields.createdAt.value} < '${ postgreeDateFormat(filter.end) }' `;
  
        logCallFilter += ` 
        ${LOG_CALL.fields.startedAt.value} >= '${ postgreeDateFormat(filter.start) }' 
        AND ${LOG_CALL.fields.startedAt.value} < '${ postgreeDateFormat(filter.end) }' `;
        
        logConferenceFilter += ` 
        ${LOG_CONFERENCE.fields.startedAt.value} >= '${ postgreeDateFormat(filter.start) }' 
        AND ${LOG_CONFERENCE.fields.startedAt.value} < '${ postgreeDateFormat(filter.end) }' `;
      }
  
      if (filter.users && filter.users.length > 0) {
        let users = filter.users.map( (u: any) => `'${u}'`).toString();
        if (filter.users.length > 1) {
          userLogAccessFilter = ` ${LOG_ACCESS.fields.userId.value} IN (${users})`;
          userLogCallFilter = ` ${LOG_CALL.fields.userIdFrom.value} IN (${users})`;
          userLogConferenceFilter = ` ${LOG_CONFERENCE.fields.userIdFrom.value} IN (${users})`;
        } else {
          userLogAccessFilter = ` ${LOG_ACCESS.fields.userId.value} = ${users} `;
          userLogCallFilter = ` ${LOG_CALL.fields.userIdFrom.value} = ${users} `;
          userLogConferenceFilter = ` ${LOG_CONFERENCE.fields.userIdFrom.value} = ${users} `;
        }

        if (logAccessFilter !== where) {
          logAccessFilter += and + userLogAccessFilter;
          logCallFilter += and + userLogCallFilter;
          logConferenceFilter += and + userLogConferenceFilter;
        } else {
          logAccessFilter += userLogAccessFilter;
          logCallFilter += userLogCallFilter;
          logConferenceFilter += userLogConferenceFilter;
        }
      }
    }

    const q = `
      SELECT   tla.createdat  AS createdat, 
              Sum(tla.logincount) AS logincount, 
              Sum(tla.timelogged) AS timelogged, 
              Sum(tlc.audiocount)  AS audiocount, 
              Sum(tlc.videocount)  AS videocount, 
              Sum(tlconf.confcount)  AS confcount, 
              Sum(audioduration)  AS audioduration, 
              Sum(videoduration)  AS videoduration, 
              Sum(confduration)  AS confduration 
      FROM     ( 
        SELECT   createdat, 
                Sum(logincount) AS logincount, 
                Sum(timelogged) AS timelogged 
        FROM     ( 
                          SELECT   Date_trunc('day', la.${fields.createdAt.value})                                                AS createdat,
                                  Count(*) filter (WHERE ${fields.isLogoff.value} = false)                                       AS logincount,
                                  COALESCE( lead(la.${fields.createdAt.value}) OVER(ORDER BY la.${fields.createdAt.value} ASC)) - la.${fields.createdAt.value} AS timelogged
                          FROM     ${LOG_ACCESS.name} la 
                          ${logAccessFilter}
                          GROUP BY ${fields.createdAt.value} 
                          ORDER BY ${fields.createdAt.value}) AS tlatemp 
        WHERE    tlatemp.logincount > 0 
        GROUP BY tlatemp.createdat) AS tla FULL JOIN ( 
          SELECT startedat, 
                Sum(audiocount) AS audiocount, 
                Sum(videocount) AS videocount, 
                Sum(audioduration)  AS audioduration, 
                Sum(videoduration)  AS videoduration 
          FROM   (SELECT Date_trunc('day', lc.${LOG_CALL.fields.startedAt.value})  AS startedat, 
                        Count(*) filter (WHERE ${LOG_CALL.fields.type.value} = 0) AS audiocount,
                        Count(*) filter (WHERE ${LOG_CALL.fields.type.value} = 1) AS videocount,
                        CASE ${LOG_CALL.fields.type.value} WHEN 0 THEN ( lc.${LOG_CALL.fields.endedAt.value} - lc.${LOG_CALL.fields.startedAt.value} ) ELSE '0' END AS audioduration, 
                        CASE ${LOG_CALL.fields.type.value} WHEN 1 THEN ( lc.${LOG_CALL.fields.endedAt.value} - lc.${LOG_CALL.fields.startedAt.value} ) ELSE '0' END AS videoduration
                  FROM   ${LOG_CALL.name} lc 
                  ${logCallFilter}
                  GROUP  BY ${LOG_CALL.fields.startedAt.value}, 
                            ${LOG_CALL.fields.endedAt.value}, 
                            ${LOG_CALL.fields.type.value} 
                  ORDER  BY ${LOG_CALL.fields.startedAt.value}) AS tlctemp 
          GROUP  BY tlctemp.startedat ) AS tlc ON tla .createdat = tlc.startedat FULL JOIN (
            SELECT startedat, 
                  Sum(confcount)    AS confcount, 
                  Sum(confduration) AS confduration 
            FROM   (SELECT Date_trunc('day', lconf.${LOG_CONFERENCE.fields.startedAt.value})     AS startedat, 
                          Count(*)                                 AS confcount, 
                          ( lconf.${LOG_CONFERENCE.fields.endedAt.value} - lconf.${LOG_CONFERENCE.fields.startedAt.value} ) AS confduration 
                    FROM   ${LOG_CONFERENCE.name} lconf 
                    ${logConferenceFilter}
                    GROUP  BY ${LOG_CONFERENCE.fields.startedAt.value}, 
                              ${LOG_CONFERENCE.fields.endedAt.value} 
                    ORDER  BY ${LOG_CONFERENCE.fields.startedAt.value}) AS tlconftemp 
            GROUP  BY tlconftemp.startedat ) as tlconf ON tla .createdat = tlconf.startedat
      GROUP BY tla.createdat
    `;
    
    const query = await this.client.query(q).catch(err => err);
    return query;
  }

  getByUser(userId: string) {
    const q = `
    SELECT 
      createdat, logincount, timelogged 
    FROM 
      (SELECT 
        date_trunc('day', la.created_at) as createdat, 
        COUNT(*) filter (where is_logoff = false) as logincount, 
        coalesce( 
          lead(la.created_at) over(order by la.created_at asc)
        ) - la.created_at as timelogged 
        FROM log_acesso la 
        WHERE usuario = "${userId}"
        GROUP BY created_at 
        ORDER BY created_at
      ) as result 
    WHERE logincount > 0`;
  }
}

// `SELECT   tla.createdat  AS createdat, 
//         Sum(tla.logincount) AS logincount, 
//         Sum(tla.timelogged) AS timelogged, 
//         Sum(tlc.audiocount)  AS audiocount, 
//         Sum(tlc.videocount)  AS videocount, 
//         Sum(tlconf.confcount)  AS confcount, 
//         Sum(audioduration)  AS audioduration, 
//         Sum(videoduration)  AS videoduration, 
//         Sum(confduration)  AS confduration 
// FROM     ( 
//   SELECT   createdat, 
//           Sum(logincount) AS logincount, 
//           Sum(timelogged) AS timelogged 
//   FROM     ( 
//                     SELECT   Date_trunc('day', la.created_at)                                                AS createdat,
//                             Count(*) filter (WHERE is_logoff = false)                                       AS logincount,
//                             COALESCE( lead(la.created_at) OVER(ORDER BY la.created_at ASC)) - la.created_at AS timelogged
//                     FROM     log_acesso la 
//                     WHERE la.created_at < ""
//                     GROUP BY created_at 
//                     ORDER BY created_at) AS tlatemp 
//   WHERE    tlatemp.logincount > 0 
//   GROUP BY tlatemp.createdat) AS tla FULL JOIN ( 
//     SELECT startedat, 
//           Sum(audiocount) AS audiocount, 
//           Sum(videocount) AS videocount, 
//           Sum(audioduration)  AS audioduration, 
//           Sum(videoduration)  AS videoduration 
//     FROM   (SELECT Date_trunc('day', lc.data_inicio)  AS startedat, 
//                   Count(*) filter (WHERE tipo_chamada = 0) AS audiocount,
//                   Count(*) filter (WHERE tipo_chamada = 1) AS videocount,
//                   CASE tipo_chamada WHEN 0 THEN ( lc.data_final - lc.data_inicio ) ELSE '0' END AS audioduration, 
//                   CASE tipo_chamada WHEN 1 THEN ( lc.data_final - lc.data_inicio ) ELSE '0' END AS videoduration
//             FROM   log_chamada lc 
//             GROUP  BY data_inicio, 
//                       data_final, 
//                       tipo_chamada 
//             ORDER  BY data_inicio) AS tlctemp 
//     GROUP  BY tlctemp.startedat ) AS tlc ON tla .createdat = tlc.startedat FULL JOIN (
//       SELECT startedat, 
//             Sum(confcount)    AS confcount, 
//             Sum(confduration) AS confduration 
//       FROM   (SELECT Date_trunc('day', lconf.data_inicio)     AS startedat, 
//                     Count(*)                                 AS confcount, 
//                     ( lconf.data_final - lconf.data_inicio ) AS confduration 
//               FROM   log_conferencia lconf 
//               GROUP  BY data_inicio, 
//                         data_final 
//               ORDER  BY data_inicio) AS tlconftemp 
//       GROUP  BY tlconftemp.startedat ) as tlconf ON tla .createdat = tlconf.startedat
// GROUP BY tla.createdat`