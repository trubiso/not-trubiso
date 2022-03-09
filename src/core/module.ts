import Command from '@core/command';

export default interface Module {
  name: string;
  help: {
    name: string;
    brief: string;
  };
  commands: Command[];
}
