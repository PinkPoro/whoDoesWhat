export interface Employee {
  id: number;
  name: string;
}

export interface Position {
  id: number;
  name: string;
  employeeId: number;
  period: {
    start: string;
    end: string;
  };
}

export interface Task {
  id?: number;
  name: string;
  employeeId: number;
  date: string;
}

export interface Assignment {
  employee: Employee;
  positions: {
    position: Position;
    tasks: Task[];
  }[];
}
