export type user = {
    username: string,
    password:string,
    name: string,
    phone: string,
    email:string,
    tz: string,
    id: number|null
}
export type Ingrident= {

    Name :string
    Count :number
    Type:string

}
export type Recipise={
    Id:number,
    Name :string,
    Instructions :[{Name:""}],
    Difficulty :'low'|'medum'|'high',
   Duration :number,
   Img:string,
   Ingridents :Ingrident[]
   UserId :number,
   CategoryId:number,
   Description :string
  
}
export type Category= {
    id: number;    // שימוש ב-camelCase ב-frontend
    name: string;  // שימוש ב-camelCase ב-frontend
  }