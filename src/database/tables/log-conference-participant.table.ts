import { Client } from "pg";
import { LOG_CONFERENCE_PARTICIPANT, LOG_CONFERENCE } from "./config";
import { errorGenerator } from "../../components/error";
import { ITableHandler } from "../../interfaces";
import { Sequelize } from "sequelize";
import * as sequelize from "sequelize";
import { logConferenceParticipantQuery } from "./test/queries.spec";

export class LogConferenceParticipant implements ITableHandler{

  sequelize: Sequelize;
  model: sequelize.Model<string, {}>;

  constructor(sequelize: Sequelize){
    this.sequelize = sequelize;
  }

  initialize(modelForeign: sequelize.Model<string, {}>) {

    const { fields } = LOG_CONFERENCE_PARTICIPANT;

    this.model = this.sequelize.define(LOG_CONFERENCE_PARTICIPANT.name, {
      [fields.id.value]: {
        type: sequelize.UUID,
        primaryKey: fields.id.primaryKey
      },
      [fields.createdAt.value]: {
        type: sequelize.DATE,
        allowNull: false,
        defaultValue: sequelize.NOW
      },
      [fields.userId.value]: {
        type: sequelize.UUID,
        allowNull: false
      },
      [fields.gotInAt.value]: {
        type: sequelize.DATE,
        allowNull: false
      },
      [fields.gotOutAt.value]: {
        type: sequelize.DATE,
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

    this.model.belongsTo(modelForeign);
  }

  async createMocks() {
    const operation = await logConferenceParticipantQuery(this.model);
    return operation;
  }

  async drop() {
    const operation = await this.model.drop().catch(err => err);
    return operation;
  }
}

export const LogConferenceParticipantInstance = (
  sequelize: Sequelize,
  modelForeign: sequelize.Model<string, {}>
) => {
  const logConference = new LogConferenceParticipant(sequelize);
  logConference.initialize(modelForeign);
  return logConference;
}
