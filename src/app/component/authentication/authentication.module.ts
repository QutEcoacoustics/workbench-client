import loginRoutes, resetRoutes from "pages/blah"

let children = [resetRoutes, loginRoutes,].flatten();
@NgModule({
  imports: [ RouterModule.forChild(children) ],
  exports: [ RouterModule ]
})
export class AuthenticationModule {}