const AccessControl = require('accesscontrol')
const ac = new AccessControl()

exports.roles = (function () {
    ac.grant('patient')
        .readOwn('patient_profile')
        .updateOwn('patient_profile')
        .readAny('doctor_profile')

    ac.grant('doctor')
        .updateOwn('doctor_profile')
        .readAny(['patient_profile', 'doctor_profile'])
        .deleteAny('forumQuestions')

    ac.grant('admin')
        .extend('patient')
        .extend('doctor')
        .updateAny(['patient_profile', 'doctor_profile'])
        .deleteAny(['patient_profile', 'doctor_profile'])

    return ac
})()