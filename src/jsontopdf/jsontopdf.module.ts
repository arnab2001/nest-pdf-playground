import { Module } from '@nestjs/common';
import { JsonToPdfService } from './jsontopdf.service';
import {JsonToPdfController} from './json.controller';

@Module({
    controllers: [JsonToPdfController],
    providers: [JsonToPdfService],
})
export class JsonToPdfModule {}