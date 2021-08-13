import { Component, OnInit } from '@angular/core';
import { CatCompetencialesService } from 'services/data';
import { ICCompAddDTO } from 'sharedInterfaces/DTO';
import { ICatComp } from 'sharedInterfaces/Entity';
import { LogService } from 'src/app/shared/log/log.service';

interface ICatCompetEdit extends ICatComp {
	editing?: boolean;
}

/**
 * Component used for competency category viewing / editing
 */
@Component({
	selector: 'app-table-compet',
	templateUrl: './table-compet.component.html',
	styleUrls: ['./table-compet.component.scss'],
})
export class TableCatCompComponent implements OnInit {
	constructor(private catCompService: CatCompetencialesService, private readonly logger: LogService) {}

	catCompToAdd: ICCompAddDTO[] = [];
	catComps: ICatCompetEdit[] = [];

	async ngOnInit(): Promise<void> {
		this.logger.verbose('Cargando componente table-compet');
		await this.updateCatCompView();
	}

	/**
	 * Actualiza las categorías competenciales de manera asincrona
	 */
	async updateCatCompView(): Promise<void> {
		this.logger.verbose('Actualizando vista de catComp');
		this.catComps = await this.catCompService.getAll();
	}

	/**
	 * Elimina una Categoria Competencial de la lista temporal catCompToAdd (Las catComp creadas en memoria no persistidas)
	 *
	 * @param cComp La catComp a borrar
	 */
	deleteCatCompToAdd(cComp: ICatComp): void {
		this.logger.debug('Eliminando catComp de la vista de edición', cComp);
		this.catCompToAdd.splice(this.catCompToAdd.indexOf(cComp), 1);
	}

	/**
	 * Anade una categoría competencial a la lista catCompToAdd (cComps no grabadas en la bbdd)
	 */
	newEmptyCatComp(): void {
		this.logger.debug('Añadiendo campo vacío a la lista para añadir catComps', {
			datosAIntroducir: this.catCompToAdd,
		});
		this.catCompToAdd.push({
			id: '',
			description: '',
		});
	}

	/**
	 *
	 * @param cComp La categoria competencial a editar/mandar
	 * @param editing `true` si se quiere mostrar un input en descripción, `false` caso contrario
	 * @param send	`true` si se quiere mandar esa categoria competencia al backend `false` si no
	 */
	async editingCatComp(cComp: ICatCompetEdit, editing: boolean, send: boolean): Promise<void> {
		this.logger.debug(
			`Editando cComp con ID: ${cComp.id}, ¿mostrar input en descripcion?: ${editing}, ¿mandar al backend?: ${send}`,
			cComp,
		);
		cComp.editing = editing;
		if (send) {
			delete cComp.editing;
			await this.catCompService.edit(cComp);
		}
	}

	/**
	 * Persiste una categoria competencial
	 *
	 * @param cComp La categoria competencial a persistir
	 * @returns Una promesa void
	 */
	async persistCatComp(cComp: ICCompAddDTO): Promise<void> {
		this.logger.debug(`Persistiendo cComp con ID: ${cComp.id}`, cComp);
		const guardado = await this.catCompService.add(cComp);
		if (guardado) {
			//?Posible cambio a borrarla sin volver a preguntar al backend, modificando compets
			this.deleteCatCompToAdd(cComp);
			this.logger.verbose('Persistido con éxito, mostrando en la lista de cComps');
			return this.updateCatCompView();
		}
	}

	/**
	 * Borra una categoria competencial de la bbdd
	 *
	 * @param catComp La categoria competencial a borrar
	 * @returns Una promesa de tipo void
	 */
	async deleteCatComp(cComp: ICatComp) {
		this.logger.debug(`Eliminando cComp con ID: ${cComp.id}`);
		const borrado = await this.catCompService.delete(cComp);
		if (borrado) {
			this.logger.verbose('Borrado con éxito');
			//?Posible cambio a borrarla sin volver a preguntar al backend, modificando compets
			return this.updateCatCompView();
		}
	}
}
