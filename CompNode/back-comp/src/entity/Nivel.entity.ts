import { ApiProperty } from '@nestjs/swagger';
import { INivel } from 'sharedInterfaces/Entity';
import { Entity, BaseEntity, OneToMany, PrimaryGeneratedColumn, Column } from 'typeorm';
import { SubModel } from '.';

@Entity()
export class Nivel extends BaseEntity implements INivel {
	@ApiProperty()
	@PrimaryGeneratedColumn()
	id: number;

	@ApiProperty()
	@Column({ type: 'varchar', unique: false, nullable: false })
	code: string;

	@ApiProperty()
	@Column({ type: 'float8', unique: false, nullable: false })
	valor: number;

	@ApiProperty()
	@Column({ type: 'float8', unique: false, nullable: false })
	minRango: number;
	@ApiProperty()
	@Column({ type: 'float8', unique: false, nullable: false })
	maxRango: number;

	@ApiProperty({ type: () => SubModel })
	@OneToMany(type => SubModel, subm => subm.nivel)
	subModels: SubModel[];
	// TODO: Elegir un nombre correcto
}
