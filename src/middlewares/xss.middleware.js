function sanitizeUserInput(req, res, next) {
    if (req.query) {
        if (containsDangerousInput(req.query)) {
            return res.status(400).send('Bad Request: Detected potential XSS vulnerability in query parameters.');
        }
    }
    if (req.body) {
        if (containsDangerousInput(req.body)) {
            return res.status(400).send('Bad Request: Detected potential XSS vulnerability in request body.');
        }
    }

    if (req.params) {
        if (containsDangerousInput(req.params)) {
            return res.status(400).send('Bad Request: Detected potential XSS vulnerability in request parameters.');
        }
    }

    next();
}

function containsDangerousInput(obj) {
    // Check if any value in the object contains potential dangerous input
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key) && hasPotentialXSS(obj[key])) {
            return true;
        }
    }
    return false;
}

function hasPotentialXSS(value) {
    const regex = /<script>|<\/script>/i;
    return regex.test(value);
}

module.exports = sanitizeUserInput;
