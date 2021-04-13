import { Body, ConflictException, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CatComp } from 'src/entity/CatComp.entity';
import { CatContr } from '../../entity/CatContr.entity';
import { CatContrRepo } from './catContr.repository';
// import { ICategoriesRelation } from '../../../../interfaces/ICategorias';
@Controller('nest/catcontr')
export class CatContractController {
	constructor(
		@InjectRepository(CatContrRepo)
		private readonly contrRepo: CatContrRepo,
	) {}

	@Get('all')
	getAllCompt(): Promise<CatContr[]> {
		return this.contrRepo.find();
	}

	@Delete(':id')
	async deleteCompt(@Param('id') id: string): Promise<boolean> {
		const compt = await this.contrRepo.findOne({ id: id });
		if (!compt) {
			throw new NotFoundException('No existe ninguna competencia con ese id');
		}
		var oneWeekAgo: Date = new Date();
		oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

		await compt.remove();
		return true;
	}

	@Post('')
	async createCompt(@Body() compt: CatContr): Promise<boolean> {
		const existingCompt = await this.contrRepo.findOne({ id: compt.id });
		if (existingCompt) {
			throw new ConflictException('CatContr ya creada');
		}
		await this.contrRepo.save(compt);
		return true;
	}
	@Put('')
	async updateCompt(@Body() compt: CatContr): Promise<boolean> {
		const existingCompt = await this.contrRepo.findOne({ id: compt.id });
		if (!existingCompt) {
			throw new NotFoundException('No existe una competencia con ese id');
		}
		await this.contrRepo.save(compt);
		return true;
	}
}
