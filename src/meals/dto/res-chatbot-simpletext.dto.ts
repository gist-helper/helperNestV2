
import { IsNotEmpty } from "class-validator"

interface Response {
  template: Template
  version: string
}
  
interface Template {
  outputs: Output[]
}
  
interface Output {
  simpleText: SimpleText
}
  
interface SimpleText {
  text: string
}
  
export class ChatbotSimpleTextResDto {
    @IsNotEmpty()
    response: Response
} 