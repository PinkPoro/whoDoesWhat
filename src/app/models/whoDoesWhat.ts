export interface Employee {
  id: number;
  name: string;
}

export interface Position {
  id?: number;
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
  task: Task;
  employee: Employee | null;
  position: Position | null;
}
