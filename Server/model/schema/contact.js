const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    interestProperty: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Properties',
    }],
    quotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quotes',
    }],
    createBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedDate: {
        type: Date,
        default: Date.now
    },
    createdDate: {
        type: Date,
    },
    deleted: {
        type: Boolean,
        default: false,
    },
});

const initializeContactSchema = async () => {
    try {
        if (mongoose.modelNames().includes('CustomField')) {
            const CustomFieldModel = mongoose.model('CustomField');
            const schemaFieldsData = await CustomFieldModel.find({ moduleName: "Contacts" });
            
            if (schemaFieldsData && schemaFieldsData.length > 0 && schemaFieldsData[0]?.fields) {
                schemaFieldsData[0].fields.forEach((item) => {
                    contactSchema.add({ [item.name]: item?.backendType });
                });
            }
        }
    } catch (error) {
        console.error('Error initializing contact schema:', error);
    }
};

let Contact;
try {
    Contact = mongoose.models.Contacts || mongoose.model('Contacts', contactSchema);
} catch (error) {
    Contact = mongoose.model('Contacts', contactSchema);
}

module.exports = { Contact, initializeContactSchema };