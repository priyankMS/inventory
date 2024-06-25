import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/modules/user/schema/user.schema';

@Schema()
export class Bank {
    @Prop({ required: true })
    bankName: string;

    @Prop({ unique: true, required: true })
    ifscCode: string;

    @Prop({ unique: true, required: true })
    accountNumber: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    createdBy?: User;

}

export const bankSchema = SchemaFactory.createForClass(Bank);
