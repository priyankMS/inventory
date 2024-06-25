import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/modules/user/schema/user.schema';

@Schema()
export class Business {
    @Prop({ required: true })
    companyname: string;

    @Prop({ unique: true, required: true })
    emails: string;

    @Prop({ unique: true, required: true })
    gstnumber: string;

    @Prop({ unique: true, required: true })
    mobailnumber: Number;

    @Prop({ required: true })
    Address: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    createdBy?: User;

}

export const businessSchema = SchemaFactory.createForClass(Business);
