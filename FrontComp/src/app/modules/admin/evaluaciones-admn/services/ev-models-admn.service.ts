import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IEvModelGetDTO, IModelDTO, IRefModel } from 'sharedInterfaces/DTO';
import { ICatComp } from 'sharedInterfaces/Entity';
import { environment as cnf } from 'src/environments/environment';

/** Servicio crud para el manejo de los modelos de las evaluaciones */
@Injectable({ providedIn: 'root' })
export class EvModelsAdmnService {
	constructor(private httpClient: HttpClient) {}

	/**
	 *
	 * @param evModel The model to save
	 * @param reference `true` if it is a model reference, `false` if not
	 * @returns A `Promise` that it's `true` if it has been saved, exception if not
	 */
	save(evModel: IModelDTO, reference: boolean): Promise<IEvModelGetDTO> {
		// console.log(String(reference));
		// TODO: Cambiado a boolean, al serializar se queda true en vez de "true", comprobar en backend que es boolean con pipe
		return this.httpClient
			.post<IEvModelGetDTO>(`${cnf.apiURL}/modelos`, evModel, { params: { reference: reference } })
			.toPromise();
	}

	getAll(): Promise<IEvModelGetDTO[]> {
		return this.httpClient.get<IEvModelGetDTO[]>(`${cnf.apiURL}/modelos`).toPromise();
	}

	/**
	 * @returns `Array` with all refence evModels
	  * TODO: DONE, testear
	 */
	getAllReference(): Promise<IModelDTO[]> {
		return this.httpClient.get<IModelDTO[]>(`${cnf.apiURL}/modelos/references`).toPromise();
	}

	/**
	 * @param catComp The id from the catComp to get the reference
	 * @returns The reference model with the catComp selected
	 * TODO: DONE, testear
	 */
	getOneReference(catComp: ICatComp | ICatComp['id']): Promise<IModelDTO> {
		const id = typeof catComp === 'string' ? catComp : catComp.id;
		return this.httpClient.get<IRefModel>(`${cnf.apiURL}/modelos/reference/${id}`).toPromise();
	}

	/**
	 *
	 * @param refModel The reference model to update
	 * @returns A `Promise` that it's `true` if it has been updated, exception if not
	 * @throws TODO: complete
	 * TODO: DONE, testear
	 *
	 */
	updateRefModel(refModel: IModelDTO): Promise<boolean> {
		return this.httpClient
			.put<boolean>(`${cnf.apiURL}/modelos/reference`, refModel, { params: { reference: 'true' } })
			.toPromise();
	}
}
