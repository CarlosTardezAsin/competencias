import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ITrabajador } from '../../../../../../../interfaces/IUser';
import { environment as cnf } from '../../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TrabajadoresService {
	constructor(private httpClient: HttpClient) {}
	async delete(worker: ITrabajador): Promise<boolean> {
		await this.httpClient.delete(`${cnf.apiURL}/CHANGEME/${worker.dni}`).toPromise();
		return true;
	}

	/**
	 * Metodo que obtiene todas los CHANGEME del backend, usado solo para el ADMIN
	 *
	 * @returns Un `Array` de todos los CHANGEME
	 */
	public getAllTrabajadores(): Promise<ITrabajador[]> {
		return this.httpClient.get<ITrabajador[]>(`${cnf.apiURL}/CHANGEME/all`).toPromise();
	}

	/**
	 * Metodo que borra un worker del backend
	 *
	 * @returns Una promesa que es `True` si se ha borrado `False` en caso contrario
	 */
	async borrarTrabajador(id: string): Promise<boolean> {
		var borrado = false;
		try {
			borrado = await this.httpClient.delete<boolean>(`${cnf.apiURL}/CHANGEME/${id}`).toPromise();
		} catch (error) {
			console.log(error);
			//TODO: Excepción si hay error lanzar a controlador (Componente)
			alert('No se ha podido borrar ese worker, contacte con un administrador.');
		}
		return borrado;
	}

	/** POST: add a new worker to the server */
	addTrabajador(worker: ITrabajador): Promise<boolean> {
		return this.httpClient.post<boolean>(`${cnf.apiURL}/CHANGEME`, worker).toPromise();
	}
	/**
	 *
	 * @param comp El worker a editar en la base de datos
	 * @returns Una promesa que es `True` si se ha editado `False` en caso contrario
	 */
	editTrabajador(worker: ITrabajador): Promise<boolean> {
		return this.httpClient.put<boolean>(`${cnf.apiURL}/CHANGEME`, worker).toPromise();
	}
}
