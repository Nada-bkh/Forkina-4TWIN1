import mongoose from "mongoose";

const verifyEmailTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  email: { // Ajout du champ email
    type: String,
    required: true,
  },
  expiresAt: { // Ajout du champ expiresAt pour la date d'expiration
    type: Date,
    required: true,
  }
});

export const VerifyEmailToken = mongoose.model('VerifyEmailToken', verifyEmailTokenSchema);

export default VerifyEmailToken
