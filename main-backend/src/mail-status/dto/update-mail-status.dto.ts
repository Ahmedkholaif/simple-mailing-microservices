import { PartialType } from "@nestjs/mapped-types"
import { CreateMailStatusDto } from "./create-mail-status.dto";

export class UpdateMailStatusDto extends PartialType(CreateMailStatusDto) {}
