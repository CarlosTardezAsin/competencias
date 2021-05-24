import { Component, OnInit } from '@angular/core';
import { IModelDTO } from 'sharedInterfaces/DTO/IModelDTO';
import { CompetenciasService } from '../../competencias-admin/services/competencias.service';
import { CatCompetencialesService } from '../../cat-admn/services/CatCompetenciales.service';
import { ComportService } from '../../comportamientos-admin/services/comport.service';
import { NivelService } from '../../niveles-admin/services/nivel.service';
import { EvModelsAdmnService } from '../services/ev-models-admn.service';
import { ICatComp, ICompetencia, IComportamiento, INivel, ISubModel } from 'sharedInterfaces/Entity';
import { WithOptional } from 'sharedInterfaces/Utility';

type IModelPreDTO = Partial<IModelDTO> &
	Omit<IModelDTO, 'catComp' | 'evs' | 'subModels'> & {
		subModels: WithOptional<ISubModel, 'nivel'>[];
	};

export type DbData = {
	/** listado de categorias competenciales */
	catComps: ICatComp[];
	/** listado de competencias */
	comps: ICompetencia[];
	/** listado de comportamientos */
	comports: IComportamiento[];
	/** listado de niveles */
	niveles: INivel[];
	/** El modelo que se enviará al backend, sobre este se realizan las modificaciones */
	modelToAdd: IModelPreDTO;
};

type MiCompetencia = {
	nivObjetivo?: INivel;
} & ICompetencia;
/** Tipo que sirve para concatena nivel, competencia e IComportortamiento */
type MiComportamiento = {
	nivel?: INivel;
	competencia?: ICompetencia;
} & IComportamiento;
/**
 * Tipo que agrupa competencias seleccionadas, nivel seleccionado y comportamientos seleccionados
 */
type ComportCtrlView = {
	/** La ultima competencia seleccionada */
	compSelected?: ICompetencia;
	nivSelected?: INivel;
	comportsSelected: IComportamiento[];
};
/**
 * Interfaz de validadores generica, cada propiedad del objeto que implemente esta interfaz ha de
 * ser una función que devuelva un boolean o Promise<boolean>
 *
 * `TRUE` Si es valido, `FALSE` si no
 */
interface EvModalValidators {
	[key: string]: (...args: any[]) => boolean | Promise<boolean>;
}

/**
 * Componente dedicado a crear un nuevo modelo usado para las evaluaciones
 *
 */
@Component({
	selector: 'app-new-ev-model',
	templateUrl: './new-ev-model.component.html',
	styleUrls: ['./new-ev-model.component.css'],
})
export class NewEvModelComponent implements OnInit {
	/** Objeto que tiene los datos usados para los select */
	dbData: DbData = {
		catComps: [],
		comps: [],
		comports: [],
		niveles: [],
		modelToAdd: {
			catComp: undefined,
			subModels: [],
		},
	};

	comportCtl: ComportCtrlView = {
		compSelected: undefined,
		nivSelected: undefined,
		comportsSelected: [],
	};
	/** Contiene todas las funciones usadas para validar datos en este componente */
	validators: EvModalValidators = {
		nivObjetivoValidator: (comps: MiCompetencia[]) =>
			comps.every(c => {
				if (!c.nivObjetivo) return false;
				return true;
			}),
	};
	/** Guarda la lista de competencias seleccionadas */
	//! Mejor en un objeto ctrlView o intentar no usar esta y añadir logica en el html para buscar en el dbData.modelToAdd
	competenciasSelect: MiCompetencia[] = [];
	/** Guarda la lista de comportamientos seleccionados */
	comportamientosSelect: MiComportamiento[] = [];
	/** Posicion actual de la vista (sirve para comprobar si se puede pasar y volver de tab) */
	current = 0;

	constructor(
		private catCompService: CatCompetencialesService,
		private competSv: CompetenciasService,
		private nivSv: NivelService,
		private comportSv: ComportService,
		private evModelSv: EvModelsAdmnService,
	) {}

	async ngOnInit(): Promise<void> {
		const promises = await Promise.all([
			this.catCompService.getAll(),
			this.competSv.getAll(),
			this.nivSv.getAll(),
			this.comportSv.getAll(),
		]);
		this.dbData.catComps = promises[0];
		this.dbData.comps = promises[1];
		this.dbData.niveles = promises[2];
		this.dbData.comports = promises[3];
		setInterval(() => {
			console.log(this);
		}, 3500);
	}

	/** Selecciona la categoría competentencial que va a tener el modelo
	 *
	 * @param catCompet la categoría competencial elegida
	 */
	selectCatComp(catCompet: ICatComp) {
		this.dbData.modelToAdd.catComp = catCompet;
	}

	/**
	 * Añade o quita del {@link NewEvModelComponent.dbData| modelToAdd} los subModelos con esa competencia
	 *
	 * @param comp La competencia que se usa para buscar los subModelos que la poseen
	 */
	toggleComp(comp: ICompetencia) {
		let _modelToAdd = this.dbData.modelToAdd;
		console.log(this.findSubModels(_modelToAdd.subModels, comp));
		if (this.findSubModels(_modelToAdd.subModels, comp).length === 0) {
			//Se añade la competencia
			_modelToAdd.subModels.push({
				competencia: comp,
				nivel: undefined,
				comportamientos: [],
			});
			this.competenciasSelect.push(comp);
		} else {
			//Se elimina la competencia
			_modelToAdd.subModels = _modelToAdd.subModels.filter(subModel => subModel.competencia !== comp);
			const compIndx = this.competenciasSelect.indexOf(comp);
			this.competenciasSelect.splice(compIndx, 1);
		}
	}

	/** Selecciona los comportamientos que va tener el submodelo
	 *
	 * @param comport comportamiento seleccionado
	 */
	selectComportamiento(comport: IComportamiento) {
		const arrToPush = this.comportCtl.comportsSelected;
		const index = this.comportCtl.comportsSelected.indexOf(comport);
		if (index == -1) {
			arrToPush.push(comport);
		} else {
			arrToPush.splice(index, 1);
		}
	}

	/**
	 * Selecciona el nivel objetivo de cada competencia
	 *
	 * @param nivel nivel objetvio seleccionado
	 * @param compet competencia seleccionada
	 */
	selectNivelObjetivo(nivel: INivel, compet: ICompetencia) {
		const index = this.competenciasSelect.indexOf(compet);
		this.competenciasSelect[index].nivObjetivo = nivel;
	}

	/**
	 * Esta función se llama en la primera vista del modal de crear modelos,
	 * al elegir una categoria competencial la ventana hace scroll automatico
	 * hasta la flecha de siguiente vista *
	 *
	 * @param element el elemento al que scrolleará al hacer click
	 */
	scrollToButton(element: HTMLElement) {
		element.scrollIntoView();
	}

	/**
	 * Comprueba que las vistas del modelo pueden moverse izquierda y derecha si existe otra vista contigua
	 *
	 */
	//TODO: los numeros no pueden ser estáticos
	move(derecha: boolean) {
		if (derecha && this.current < 3) {
			this.current++;
		}
		if (!derecha && this.current > 0) {
			this.current--;
		}
	}

	/**
	 * Va añadiendo los comportamientos que se seleccionan a comportCtl
	 *
	 */
	addAllComports(): void {
		this.comportCtl.comportsSelected.forEach(comport =>
			this.addComportToCompet(this.comportCtl.compSelected!, this.comportCtl.nivSelected!, comport),
		);
	}

	/**
	 * Añade un comportamiento con un nivel asociado a una competencia
	 * @param comp La competencia a la que se quiere añadir el comportamiento
	 * @param niv El nivel que relaciona comport y comp
	 * @param comport El comportamiento que se añade a esa comp con ese nivel
	 */
	addComportToCompet(comp: ICompetencia, niv: INivel, comport: IComportamiento): void {
		let matchSubModel = this.dbData.modelToAdd.subModels.find(
			x => x.competencia?.id === comp.id && x.nivel?.id === niv.id,
		);
		if (!matchSubModel) {
			matchSubModel = {
				nivel: niv,
				competencia: comp,
				comportamientos: [],
			};
			this.dbData.modelToAdd.subModels.push(matchSubModel);
		}
		const comportIndx = matchSubModel.comportamientos?.indexOf(comport);
		if (comportIndx === -1) {
			matchSubModel.comportamientos?.push(comport);
		}
	}

	/**
	 * @param subModels El array de submodelos en el que se busca el submodelo
	 * @param comp La competencia usada para filtrar
	 * @param niv El nivel que junto con la competencia hacen de filtro
	 * @returns El submodelo que tiene ese nivel y competencia o undefined si no se encuentra ninguno
	 */
	findSubModel(subModels: ISubModel[], comp: ICompetencia, niv: INivel): ISubModel | undefined {
		return subModels.find(subModel => subModel.competencia === comp && subModel.nivel === niv);
	}

	/**
	 * Elimina el comportamiento seleccionado de la lista de comportamientos que pertenecen a ese submodelo en concreto
	 * @param comport El comportamiento a eliminar del array
	 * @param comp La competencia usada para filtrarCo1: {
          descripcion: 'dsadsaasd',
        },
	 */
	removeComport(comport: IComportamiento, comp: ICompetencia, niv: INivel) {
		const _model = this.dbData.modelToAdd;
		const subModel = this.findSubModel(_model.subModels, comp, niv);
		const indx = subModel?.comportamientos?.findIndex(c => comport.id === c.id)!;
		subModel?.comportamientos?.splice(indx, 1);
	}

	/**
	 * @param subModels El array de submodelos en el cual se buscaran el/los submodelo/s coincidente/s
	 * @param comp La competencia que se usará como filtrado
	 * @returns El array de subModelos que tienen esa competencia
	 */
	findSubModels(subModels: ISubModel[], comp: ICompetencia): ISubModel[] {
		return subModels.filter(subModel => subModel.competencia?.id === comp.id);
	}

	/**
	 * Concatena los arrays de comportamientos que puedan tener varios submodelos, con la MISMA competencia @see {@link ISubModel}
	 * @param comp La competencia con la que se filtran los subModelos
	 * @param subModels Array de subModelos del cual se devuelven sus comportamientos (concatenados donde comp==subModel.comp)
	 * @returns El array de comportamientos que tiene esa competencia
	 */
	getAllComportsOfComp(comp: ICompetencia, subModels: ISubModel[]): IComportamiento[] {
		const subModelos = this.findSubModels(subModels, comp);
		let comports: IComportamiento[] = [];
		subModelos.forEach(s => (comports = comports.concat(s.comportamientos)));
		return comports;
	}

	/**
	 * @param comp La competencia de la que se quiere obtener los comportamientos no asociados
	 * @param subModels Array de todos los subModelos
	 * @returns Un array de comportamientos que esa competencia aun no tiene asociados
	 */
	getRemainingComports(comp: ICompetencia, subModels: ISubModel[]): IComportamiento[] {
		let comportsOfComp = this.getAllComportsOfComp(comp, subModels);
		console.log(comportsOfComp);
		let comports = this.dbData.comports.filter(
			comport => comportsOfComp.find(c => c.id === comport.id) === undefined,
		);
		console.log(comports);
		return comports;
	}

	/**
	 * Guarda un evModel en el backend, este debería venir validado, si ocurre un error se maneja la excepción
	 * @param evModel
	 */
	async saveEvModel(evModel: IModelPreDTO) {
		if (!evModel.catComp) return alert('Contacte con un programador');
		let saved: boolean = false;
		try {
			saved = await this.evModelSv.save(evModel as IModelDTO);
		} catch (err) {
			// TODO: En todas las excepciones del front mandar un log con todos los datos al backend (Crear servicio provided in root)
		}
		if (!saved) {
			alert(
				'El modelo de la evaluacion no se ha guardado correctamente, compruebe los campos o contacte con un programador',
			);
		}
	}
}
