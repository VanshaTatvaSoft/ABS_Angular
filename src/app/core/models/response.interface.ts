export interface ResponseInterface{
  success: boolean | null,
  message: string | null,
  data: any | null,
  role: string | null,
  userName: string | null,
  userId: number | null,
  isFirst: boolean | null,
  redirectTo: string | null
}