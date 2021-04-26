import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListEvComponent } from './list-ev/list-ev.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EvaluacionesAdmService } from './services/evaluaciones-adm.service';
import { ModelosComponent } from '../modelos/modelos.component';
import { NewEvModalComponent } from './new-ev-modal/new-ev-modal.component';
import { MaterialEvModule } from './MatModule/materialev.module';

/** Rutas relacionadas con el subModulo de comportamientos */
export const evRoutes: Routes = [
	{
		path: '',
		component: ListEvComponent,
	},
];

@NgModule({
	declarations: [ListEvComponent, ModelosComponent, NewEvModalComponent],
	imports: [
		CommonModule,
		RouterModule,
		SharedModule,
		// TODO: En un futuro habría que reemplazar el modulo formulario por reactiveForms, mas eficientes para el uso dado
		FormsModule,
		ReactiveFormsModule,
		MaterialEvModule,
	],
	providers: [HttpClient, EvaluacionesAdmService],
})
export class EvaluacionesAdmnModule {}
