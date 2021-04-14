const AccessControl = require('accesscontrol')
const ac = new AccessControl()

exports.roles = (function () {
    ac.grant('patient')
        .readOwn('profile')
        .updateOwn('profile')
        .readAny('profile')

    ac.grant('doctor')
        .extend('patient')
        .readAny('profile')

    ac.grant('admin')
        .extend('patient')
        .extend('doctor')
        .updateAny('profile')
        .deleteAny('profile')

    return ac
})()