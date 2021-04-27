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
        .readAny('admin_interface')
        .updateAny(['patient_profile', 'doctor_profile', 'admin_interface'])
        .deleteAny(['patient_profile', 'doctor_profile', 'admin_interface'])
        

    return ac
})()