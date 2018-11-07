import { Client } from "pg";
import { LOG_CALL } from "./config";
import { errorGenerator } from "../../components/error";
import { ITableHandler } from "../../interfaces";
import { Sequelize } from "sequelize";
import * as sequelize from "sequelize";
import { logCallQuery } from "./test/queries.spec";

export class LogCall implements ITableHandler{

  sequelize: Sequelize;
  model: sequelize.Model<string, {}>;

  constructor(sequelize: Sequelize){
    this.sequelize = sequelize;
  }

  initialize() {

    const { fields } = LOG_CALL;

    this.model = this.sequelize.define(LOG_CALL.name, {
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
      [fields.userIdTo.value]: {
        type: sequelize.UUID,
        allowNull: false
      },
      [fields.type.value]: {
        type: sequelize.INTEGER
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
      timestamps:false
    });
  }

  async createMocks() {
    const operation = await logCallQuery(this.model);
    return operation;
  }

  async drop() {
    const operation = await this.model.drop().catch(err => err);
    return operation;
  }
}

export const LogCallInstance = (sequelize: Sequelize) => {
  const logCall = new LogCall(sequelize);
  logCall.initialize();
  return logCall;
}
