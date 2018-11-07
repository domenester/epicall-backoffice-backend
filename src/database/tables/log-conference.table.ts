import { Client } from "pg";
import { LOG_CONFERENCE } from "./config";
import { errorGenerator } from "../../components/error";
import * as sequelize from "sequelize";
import { Sequelize } from "sequelize";
import { ITableHandler } from "../../interfaces";
import { logConferenceQuery } from "./test/queries.spec";

export class LogConference implements ITableHandler{

  sequelize: Sequelize;
  model: sequelize.Model<string, {}>;

  constructor(sequelize: Sequelize){
    this.sequelize = sequelize;
  }

  initialize() {

    const { fields } = LOG_CONFERENCE;

    this.model = this.sequelize.define(LOG_CONFERENCE.name, {
      [fields.id.value]: {
        type: sequelize.UUID,
        primaryKey: fields.id.primaryKey
      },
      [fields.createdAt.value]: {
        type: sequelize.DATE,
        allowNull: false,
        defaultValue: sequelize.NOW
      },
      [fields.userIdFrom.value]: {
        type: sequelize.UUID,
        allowNull: false
      },
      [fields.startedAt.value]: {
        type: sequelize.DATE,
        allowNull: false
      },
      [fields.endedAt.value]: {
        type: sequelize.DATE,
        allowNull: false
      },
      [fields.file.value]: {
        type: sequelize.STRING({ length: 255 }),
        allowNull: false
      },
      [fields.status.value]: {
        type: sequelize.INTEGER,
        allowNull: false
      }
    }, { 
      freezeTableName: true,
      timestamps: false
    });
  }

  async createMocks() {
    const operation = await logConferenceQuery(this.model);
    return operation;
  }

  async drop() {
    const operation = await this.model.drop({ cascade: true }).catch(err => err);
    return operation;
  }
}

export const LogConferenceInstance = (sequelize: Sequelize) => {
  const logConference = new LogConference(sequelize);
  logConference.initialize();
  return logConference;
}
