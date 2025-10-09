## User Prompt: I have consultation fees in appointments table in database. Now i need to add other fields related to the fee.

Dermatologist_fee, platform fee.

In general setting need to add new column called platform fee in (%) and and that fee will deduct from the consultation fees and remaing amount will be Dermatologist_fee and the (%) amount is platform fee.

I need to store this fee when appointment is created.

Also check if there is not setting for platform fee in admin side than add it

## AI Response: Implemented migration to add platform_fee and dermatologist_fee to appointments, updated Appointment model fillable and casts, and modified appointment creation to compute and persist fee breakdown using AdminSetting platform_commission_percentage (creating a default 0% setting if missing). Added this prompt record and updated prompts.json accordingly.

