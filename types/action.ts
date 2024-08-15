export type Message = {
  title: string;
  description?: string;
};

export type ValidationError = {
  field: string;
  description?: string;
};

export type ActionOutput<T = any> =
  | ({
      success: true;
      message?: Message;
    } & T)
  | {
      success: false;
      errors?: Message[];
      validationErrors?: ValidationError[];
    };
