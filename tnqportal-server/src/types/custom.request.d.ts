declare namespace Express {
    export interface Response {
      success?: (body: any) => void;
      failure?: (message: any) => void;
    }
  }