import Joi from "joi";

const DepositItemSchema = Joi.object({
  name: Joi.string().required(),
  sku: Joi.string().required(),
  price: Joi.string().required(),
  currency: Joi.string().required(),
  quantity: Joi.number().integer().required(),
});

export const DepositSchema = Joi.object({
  item_list: Joi.object({
    items: Joi.array().items(DepositItemSchema).required(),
  }).required(),
  amount: Joi.object({
    currency: Joi.string().required(),
    total: Joi.string().required(),
  }).required(),
  description: Joi.string().required(),
});
