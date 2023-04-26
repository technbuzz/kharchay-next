
export interface DBAdapter {
  signIn(data: {email: string, password: string}): Promise<void>,

}
