/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
// Generated by unplugin-vue-router. ‼️ DO NOT MODIFY THIS FILE ‼️
// It's recommended to commit this file.
// Make sure to add this file to your tsconfig.json file as an "includes" or "files" entry.

declare module 'vue-router/auto-routes' {
  import type {
    RouteRecordInfo,
    ParamValue,
    ParamValueOneOrMore,
    ParamValueZeroOrMore,
    ParamValueZeroOrOne,
  } from 'unplugin-vue-router/types'

  /**
   * Route name map generated by unplugin-vue-router
   */
  export interface RouteNamedMap {
    'root': RouteRecordInfo<'root', '/', Record<never, never>, Record<never, never>>,
    '$error': RouteRecordInfo<'$error', '/:error(.*)', { error: ParamValue<true> }, { error: ParamValue<false> }>,
    'acesso-perfis': RouteRecordInfo<'acesso-perfis', '/acesso/perfis', Record<never, never>, Record<never, never>>,
    'acesso-perfis-components-add-edit-role-dialog': RouteRecordInfo<'acesso-perfis-components-add-edit-role-dialog', '/acesso/perfis/components/AddEditRoleDialog', Record<never, never>, Record<never, never>>,
    'acesso-perfis-components-role-cards': RouteRecordInfo<'acesso-perfis-components-role-cards', '/acesso/perfis/components/RoleCards', Record<never, never>, Record<never, never>>,
    'acesso-perfis-components-user-list': RouteRecordInfo<'acesso-perfis-components-user-list', '/acesso/perfis/components/UserList', Record<never, never>, Record<never, never>>,
    'acesso-permissoes': RouteRecordInfo<'acesso-permissoes', '/acesso/permissoes', Record<never, never>, Record<never, never>>,
    'acesso-permissoes-components-add-edit-permission-dialog': RouteRecordInfo<'acesso-permissoes-components-add-edit-permission-dialog', '/acesso/permissoes/components/AddEditPermissionDialog', Record<never, never>, Record<never, never>>,
    'auth-cadastrar': RouteRecordInfo<'auth-cadastrar', '/auth/cadastrar', Record<never, never>, Record<never, never>>,
    'auth-esqueceu-senha': RouteRecordInfo<'auth-esqueceu-senha', '/auth/esqueceu-senha', Record<never, never>, Record<never, never>>,
    'auth-login': RouteRecordInfo<'auth-login', '/auth/login', Record<never, never>, Record<never, never>>,
    'auth-redefinir-senha': RouteRecordInfo<'auth-redefinir-senha', '/auth/redefinir-senha', Record<never, never>, Record<never, never>>,
    'auth-verificar-email': RouteRecordInfo<'auth-verificar-email', '/auth/verificar-email', Record<never, never>, Record<never, never>>,
    'cliente': RouteRecordInfo<'cliente', '/cliente', Record<never, never>, Record<never, never>>,
    'cliente-cadastrar': RouteRecordInfo<'cliente-cadastrar', '/cliente/cadastrar', Record<never, never>, Record<never, never>>,
    'cliente-components-form-cliente': RouteRecordInfo<'cliente-components-form-cliente', '/cliente/components/form-cliente', Record<never, never>, Record<never, never>>,
    'cliente-editar-id': RouteRecordInfo<'cliente-editar-id', '/cliente/editar/:id', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    'funcionario': RouteRecordInfo<'funcionario', '/funcionario', Record<never, never>, Record<never, never>>,
    'funcionario-cadastrar': RouteRecordInfo<'funcionario-cadastrar', '/funcionario/cadastrar', Record<never, never>, Record<never, never>>,
    'funcionario-components-form-funcionario': RouteRecordInfo<'funcionario-components-form-funcionario', '/funcionario/components/form-funcionario', Record<never, never>, Record<never, never>>,
    'funcionario-editar-id': RouteRecordInfo<'funcionario-editar-id', '/funcionario/editar/:id', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    'not-authorized': RouteRecordInfo<'not-authorized', '/not-authorized', Record<never, never>, Record<never, never>>,
    'profile-tab': RouteRecordInfo<'profile-tab', '/profile/:tab', { tab: ParamValue<true> }, { tab: ParamValue<false> }>,
    'profile-components-account-settings-account': RouteRecordInfo<'profile-components-account-settings-account', '/profile/components/AccountSettingsAccount', Record<never, never>, Record<never, never>>,
    'profile-components-account-settings-billing-and-plans': RouteRecordInfo<'profile-components-account-settings-billing-and-plans', '/profile/components/AccountSettingsBillingAndPlans', Record<never, never>, Record<never, never>>,
    'profile-components-account-settings-security': RouteRecordInfo<'profile-components-account-settings-security', '/profile/components/AccountSettingsSecurity', Record<never, never>, Record<never, never>>,
    'profile-components-billing-history-table': RouteRecordInfo<'profile-components-billing-history-table', '/profile/components/BillingHistoryTable', Record<never, never>, Record<never, never>>,
    'proposta': RouteRecordInfo<'proposta', '/proposta', Record<never, never>, Record<never, never>>,
    'proposta-cadastrar': RouteRecordInfo<'proposta-cadastrar', '/proposta/cadastrar', Record<never, never>, Record<never, never>>,
    'proposta-components-form-proposta': RouteRecordInfo<'proposta-components-form-proposta', '/proposta/components/form-proposta', Record<never, never>, Record<never, never>>,
    'proposta-components-novo-servico-modal': RouteRecordInfo<'proposta-components-novo-servico-modal', '/proposta/components/NovoServicoModal', Record<never, never>, Record<never, never>>,
    'proposta-editar-id': RouteRecordInfo<'proposta-editar-id', '/proposta/editar/:id', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    'rubricas': RouteRecordInfo<'rubricas', '/rubricas', Record<never, never>, Record<never, never>>,
    'second-page': RouteRecordInfo<'second-page', '/second-page', Record<never, never>, Record<never, never>>,
    'settings-tab': RouteRecordInfo<'settings-tab', '/settings/:tab', { tab: ParamValue<true> }, { tab: ParamValue<false> }>,
    'settings-components-account-settings-connections': RouteRecordInfo<'settings-components-account-settings-connections', '/settings/components/AccountSettingsConnections', Record<never, never>, Record<never, never>>,
    'settings-components-account-settings-notification': RouteRecordInfo<'settings-components-account-settings-notification', '/settings/components/AccountSettingsNotification', Record<never, never>, Record<never, never>>,
    'users': RouteRecordInfo<'users', '/users', Record<never, never>, Record<never, never>>,
    'users-cadastrar': RouteRecordInfo<'users-cadastrar', '/users/cadastrar', Record<never, never>, Record<never, never>>,
    'users-components-form-users': RouteRecordInfo<'users-components-form-users', '/users/components/form-users', Record<never, never>, Record<never, never>>,
    'users-editar-id': RouteRecordInfo<'users-editar-id', '/users/editar/:id', { id: ParamValue<true> }, { id: ParamValue<false> }>,
  }
}
