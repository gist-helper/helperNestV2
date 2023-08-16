import { IsNotEmpty } from "class-validator"

interface Response {
  template: Template
  version: string
}
  
interface Template {
  outputs: Output[]
}
  
interface Output {
  simpleImage: SimpleImage
}
  
interface SimpleImage {
  imageUrl: string,
  altText: string
}
  
export class ChatbotSimpleImageResDto {
    @IsNotEmpty()
    response: Response
} 