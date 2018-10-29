import { Client } from "pg";
import { LOG_ACCESS, LOG_CALL, LOG_CONFERENCE } from "../tables/config";
import { errorGenerator } from "../../components/error";

export class ReportQueries {

  client: Client;

  constructor(client: Client){
    this.client = client;
  }

  async getAll() {
    
    const { fields } = LOG_ACCESS;

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
        WHERE usuario = '${userId}'
        GROUP BY created_at 
        ORDER BY created_at
      ) as result 
    WHERE logincount > 0`;
  }
}
