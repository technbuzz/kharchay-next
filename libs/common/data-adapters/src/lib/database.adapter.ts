abstract class DatabaseAdapter {
  signIn(data:{email:string, password:string}):Promise<any>
}
