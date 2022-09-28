const objectId = (value, helpers) => {
    if (!value.match(/(\d+)/)) {
        return helpers.message('"{{#label}}" must be a valid id');
    }
    return value;
};

const password = (value, helpers) => {

    // # Validate password with 5 constraints.
    // 1- at least one uppercase letter.
    // 2- at least one lowercase letter.
    // 3- at least one number.
    // 4- at least one special characters.
    // 5- number of characters must be between 8 to 30.

    // ^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$
    // └─────┬────┘└────┬────┘└──┬───┘└──────┬──────┘└───────┬───────┘└──┬─┘
    //       │          │        │           │               │           │
    //       │          │        │           │               │           8-30 characters
    //       │          │        │           │               │
    //       │          │        │           │               allowed characters
    //       │          │        │           │
    //       │          │        │           special characters
    //       │          │        │
    //       │          │        numbers
    //       │          │
    //       │          uppercase letters
    //       │
    //       lowercase letters

    if (!value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/)) {
        return helpers.message('"{{#label}}" should be minimum 8 and maximum 30 characters, at least one uppercase letter, one lowercase letter, one number and one special character');
    }
    return value;
};

const userName = (value, helpers) => {

    // # Validate username with 5 constraints.
    // 1- only contains alphanumeric characters, underscore and dot.
    // 2- underscore or dot can't be at the end or start of username.
    // 3- underscore and dot can't come next to each other.
    // 4- each time just one occurrence of underscore or dot is valid.
    // 5- number of characters must be between 5 to 20.

    // ^(?=.{5,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z\d._]+(?<![_.])$
    // └─────┬─────┘└───┬──┘└─────┬─────┘└────┬─────┘└───┬───┘
    //       │          │         │           │          │
    //       │          │         │           │          no _ or . at the end
    //       │          │         │           │
    //       │          │         │           allowed characters
    //       │          │         │
    //       │          │         no __ or _. or ._ or .. inside
    //       │          │
    //       │          no _ or . at the beginning
    //       │
    //       5-20 characters long

    if (!value.match(/^(?=[a-zA-Z0-9._]{5,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/)) {
        return helpers.message('"{{#label}}" should be minimum 5 and maximum 20 characters, alphanumeric characters, numbers, underscore and dot');
    }
    return value;
};

const ipAddress = (value, helpers) => {
    if (!value.match(/\b((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$)){4}\b/)) {
        return helpers.message('"{{#label}}" must be a valid IP Address');
    }
    return value;
};

const ipPort = (value, helpers) => {
    if (!value.match(/^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/)) {
        return helpers.message('"{{#label}}" must be a valid Port Number');
    }
    return value;
};


module.exports = {
    objectId,
    password,
    userName,
    ipAddress,
    ipPort
};
