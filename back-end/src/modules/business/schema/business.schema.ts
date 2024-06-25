import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/modules/user/schema/user.schema';

@Schema()
export class Business {
    @Prop({ required: true })
    companyname: string;

    @Prop({ unique: true, required: true })
    email: string;

    @Prop({ unique: true, required: true })
    gst: string;

    @Prop({ unique: true, required: true })
    phone: Number;

    @Prop({ required: true })
    address: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    createdBy?: User;

}

export const businessSchema = SchemaFactory.createForClass(Business);
