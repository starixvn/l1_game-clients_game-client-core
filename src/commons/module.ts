import { AnyConstructor } from "./interface";

export interface IListener<Input, Output = any> {
  properties: string[];

  handle(input: Input): Output;
}

export interface IModule {
  listeners: AnyConstructor<IListener<any, any>>[];
}
