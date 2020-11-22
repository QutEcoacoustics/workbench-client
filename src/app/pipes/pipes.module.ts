import { NgModule } from '@angular/core';
import { IsGhostUserPipe } from './isGhostUser/is-ghost-user.pipe';
import { IsUnresolvedPipe } from './isUnresolved/is-unresolved.pipe';
import { ToRelativePipe } from './toRelative/to-relative.pipe';

const pipes = [IsGhostUserPipe, IsUnresolvedPipe, ToRelativePipe];

@NgModule({ declarations: pipes, exports: pipes })
export class PipesModule {}
