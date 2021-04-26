import { Body, ConflictException, UnprocessableEntityException } from '@nestjs/common';
import { Controller, Get, Param, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CatComp } from '../../entity/CatComp.entity';
import { Ev } from '../../entity/Ev.entity';
import { EvModel } from '../../entity/EvModel.entity';
import { Trabajador } from '../../entity/Trabajador.entity';
import { EvRepository } from './evaluaciones.repository';

@Controller('nest/evaluaciones')
export class EvaluacionesController {
	constructor(@InjectRepository(EvRepository) private readonly evRepo: EvRepository) {}

	@Get(':username')
	async getEvsOfUser(@Param('username') username: string) {
		var worker = await Trabajador.findOne({
			where: { user: username },
			relations: [
				'periodos',
				'periodos.catComp',
				'periodos.catComp.evaluaciones',
				'periodos.catComp.evaluaciones.catComp',
				'periodos.catComp.evaluaciones.model',
			],
		});
		if (!worker) {
			return;
		}
		var evs: Ev[] = [];
		//Esto recoge las evaluaciones de cada periodo y las añade a un array vacío
		worker.periodos.forEach(periodo => evs.push.apply(evs, periodo.catComp.evaluaciones));
		return evs;
	}

	@Post('')
	async createEv(@Body() ev: Ev): Promise<boolean> {
		if (await this.evRepo.findOne({ id: ev.id })) {
			throw new ConflictException(`Existe una ev con el id:${ev.id}`);
		}
		if (!ev.model) {
			throw new UnprocessableEntityException('La evaluación no tiene un modelo que exista en la bbdd');
		}
		this.evRepo.save(ev);
		return true;
	}
}
