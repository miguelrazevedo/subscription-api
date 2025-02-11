import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Subscription name is required'],
            trim: true,
            minLength: 2,
            maxLength: 100,
        },
        price: {
            type: Number,
            required: [true, 'Subscription price is required'],
            min: 0,
            max: 1000,
        },
        currency: {
            type: String,
            enum: ['USD', 'EUR', 'GBP'],
            default: 'USD',
        },
        frequency: {
            type: String,
            enum: ['daily', 'weekly', 'monthly', 'yearly'],
        },
        category: {
            type: String,
            enum: [
                'business',
                'entertainment',
                'general',
                'health',
                'science',
                'sports',
                'technology',
            ],
            required: true,
            trim: true,
        },
        status: {
            type: String,
            enum: ['active', 'cancelled', 'expired'],
            default: 'active',
        },
        startDate: {
            type: Date,
            required: true,
            validate: function (value) {
                return value <= new Date();
            },
            message: 'Start date must be in the past',
        },
        renewalDate: {
            type: Date,
            required: true,
            validate: function (value) {
                return value > this.startDate;
            },
            message: 'Renewal date must be after start date',
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
    },
    { timestamps: true }
);

subscriptionSchema.pre('save', function (next) {
    if (!this.renewalDate) {
        const renewalPeriod = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365,
        };

        this.renewalDate = new Date(this.startDate);

        // Increase the number of days based on the renewalPeriod
        this.renewalDate.setDate(
            this.renewalDate.getDate() + renewalPeriod[this.frequency]
        );
    }

    // Auto-update the status if renewal data has passed
    if (this.renewalDate < new Date()) {
        this.status = 'expired';
    }

    next();
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;
