import { LOG_ACCESS, LOG_CALL, LOG_CONFERENCE, LOG_CONFERENCE_PARTICIPANT } from "../../../../../database/tables/config";

export const logAccessQuery = () => {
  return `insert into ${LOG_ACCESS.name} (
    ${LOG_ACCESS.fields.id.value},
    ${LOG_ACCESS.fields.userId.value},
    ${LOG_ACCESS.fields.createdAt.value},
    ${LOG_ACCESS.fields.isLogoff.value}
  ) values (
    '0c6dda1a-84da-4cbf-9ea2-f8f566475b3e',
    'bc3357ba817994aa764471ccff6a375d',
    '2018-10-24 10:23:54',
    false
  ), (
    'afe6d372-42c5-4b83-8d54-136de877814e',
    'bc3357ba817994aa764471ccff6a375d',
    '2018-10-24 10:27:54',
    true
  ), (
    '683d5fd5-ccbd-4112-adef-dffd0f3adfb2',
    'bc3357ba817994aa764471ccff6a375d',
    '2018-10-24 10:29:54',
    false
  ), (
    '5cd34d6b-bd87-436a-8a96-e5c64bf887f7',
    'bc3357ba817994aa764471ccff6a375d',
    '2018-10-24 10:34:54',
    true
  ), (
    'c195dbdc-52b4-4305-b370-680668be56d5',
    'bc3357ba817994aa764471ccff6a375d',
    '2018-10-24 12:29:54',
    false
  ), (
    '719d94cf-4fe3-4b05-9fde-8437ab2b24b7',
    'bc3357ba817994aa764471ccff6a375d',
    '2018-10-24 12:34:54',
    true
  ), (
    '0760fbfe-0dab-49ba-8fd7-29197211919f',
    'bc3357ba817994aa764471ccff6a375d',
    '2018-10-29 10:24:54',
    false
  ), (
    '66e986b3-ac22-4b61-8326-92983d7781b8',
    'bc3357ba817994aa764471ccff6a375d',
    '2018-10-29 10:28:54',
    true
  );`;
};

export const logCallQuery = () => {
  return `
    insert into ${LOG_CALL.name} (
      ${LOG_CALL.fields.id.value},
      ${LOG_CALL.fields.userIdFrom.value},
      ${LOG_CALL.fields.userIdTo.value},
      ${LOG_CALL.fields.type.value},
      ${LOG_CALL.fields.startedAt.value},
      ${LOG_CALL.fields.endedAt.value},
      ${LOG_CALL.fields.file.value},
      ${LOG_CALL.fields.status.value}
    ) values (
      'df0349f4-8fc3-4c3b-a3ef-182aec58137e',
      'bc3357ba817994aa764471ccff6a375d',
      '95184185ba39e4e832b7dd95c8ff54d1',
      0,
      '2018-10-24 10:24:54',
      '2018-10-24 10:25:54',
      'path/to/record.mp3',
      2
      
    ), (
      '9756d072-0647-4f10-b9ca-1f34ab2b9f37',
      'bc3357ba817994aa764471ccff6a375d',
      '95184185ba39e4e832b7dd95c8ff54d1',
      0,
      '2018-10-24 10:26:54',
      '2018-10-24 10:27:54',
      'path/to/record.mp3',
      2
      
    ), (
      'dc02f5e6-7b24-4b3e-a2b4-1034fc2f84b7',
      '95184185ba39e4e832b7dd95c8ff54d1',
      'bc3357ba817994aa764471ccff6a375d',
      1,
      '2018-10-24 10:28:54',
      '2018-10-24 10:29:54',
      'path/to/record.mp4',
      2
    ), (
      'cd788bea-ebec-4968-a510-64b427733fe6',
      '95184185ba39e4e832b7dd95c8ff54d1',
      'bc3357ba817994aa764471ccff6a375d',
      1,
      '2018-10-24 10:30:54',
      '2018-10-24 10:32:54',
      'path/to/record.mp4',
      2
    );
  `;
}

export const logConferenceQuery = () => {
  return `
    insert into ${LOG_CONFERENCE.name} (
      ${LOG_CONFERENCE.fields.id.value},
      ${LOG_CONFERENCE.fields.userIdFrom.value},
      ${LOG_CONFERENCE.fields.startedAt.value},
      ${LOG_CONFERENCE.fields.endedAt.value},
      ${LOG_CONFERENCE.fields.file.value},
      ${LOG_CONFERENCE.fields.status.value}
    ) values (
      '0f7d1aaf-3638-4a24-bf72-ab5c4d6919c2',
      'bc3357ba817994aa764471ccff6a375d',
      '2018-10-24 10:24:54',
      '2018-10-24 10:25:54',
      'path/to/record',
      2
      
    ), (
      'ff647edd-32a5-4b01-94ac-ad944cc7c7d9',
      '95184185ba39e4e832b7dd95c8ff54d1',
      '2018-10-24 10:25:54',
      '2018-10-24 10:26:54',
      'path/to/record',
      2
    );
  `;
};

export const logConferenceParticipantQuery = () => {
  return `
    insert into ${LOG_CONFERENCE_PARTICIPANT.name} (
      ${LOG_CONFERENCE_PARTICIPANT.fields.id.value},
      ${LOG_CONFERENCE_PARTICIPANT.fields.idConference.value},
      ${LOG_CONFERENCE_PARTICIPANT.fields.userId.value},
      ${LOG_CONFERENCE_PARTICIPANT.fields.gotInAt.value},
      ${LOG_CONFERENCE_PARTICIPANT.fields.gotOutAt.value},
      ${LOG_CONFERENCE_PARTICIPANT.fields.status.value}
    ) values (
      '4225dafb-7cec-4a1b-a35e-1293b494b019',
      '0f7d1aaf-3638-4a24-bf72-ab5c4d6919c2',
      '95184185ba39e4e832b7dd95c8ff54d1',
      '2018-10-24 10:24:54',
      '2018-10-24 10:25:54',
      2
    ), (
      '7798c0e0-8005-4272-85eb-11d94f6067ee',
      'ff647edd-32a5-4b01-94ac-ad944cc7c7d9',
      'bc3357ba817994aa764471ccff6a375d',
      '2018-10-24 10:26:54',
      '2018-10-24 10:27:54',
      2
    );
  `;
};