import { ICatComp } from './ICategorias';

/**
 * Interfaz que representa la información basica de una evaluación.
 *
 * @param Url /nest/evaluaciones/$USER (Username como parametro)
 */
export interface IEvaluacion {
  /** El id como integer de la evaluación */
  id: number;
  /** La descripción de la evaluación */
  description: string;
  /** El modelo que usa la evaluación (Donde se indican competencias comportamientos y niveles) */
  model: IEvModel | undefined;
  /** La categoría competencial de la evaluación */
  catComp: ICatComp;
}

export interface IEvModel {
  id: string;
  // evs: Ev[];
  catComp: ICatComp | undefined;
  /**
   * Representa los submodelos de el modelo que utiliza la evaluación
   * @see {ISubModel}
   * {@link ISubModel|link text}
   */
  subModels: ISubModel[] | undefined;
}
/** El submodelo representa el array de comportamientos que un nivel de una competencia posee */
export interface ISubModel {
  /** Los modelos a los que pertenece este SubModelo, puede ser undefined si la petición es desde el modelo o no se carga la relación del modelo */
  modelos?: IEvModel[];

  nivel: INivel | undefined;

  competencia: ICompetencia| undefined;

  comportamientos?: IComportamiento[];
}
export interface INivel {
  id: string;

  valor: number;

  subModels: ISubModel[] | undefined;
}
export interface IComportamiento {
  id: string;

  descripcion: string;

  subModels: ISubModel[] | undefined;
}
export interface ICompetencia {
  id: string;
  descripcion: string;
  createdAt: Date | undefined;
}
