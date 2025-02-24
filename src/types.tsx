export type user = {
    Username: string,
    Password:string,
    Name: string,
    Phone: string,
    Email:string,
    Tz: string,
    Id: number|null
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