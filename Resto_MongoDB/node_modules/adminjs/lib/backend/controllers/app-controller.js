/* eslint-disable no-unused-vars */
import ViewHelpers from '../utils/view-helpers/view-helpers.js';
import componentsBundler from '../bundler/user-components-bundler.js';
import layoutTemplate from '../../frontend/layout-template.js';
export default class AppController {
  constructor({
    admin
  }, currentAdmin) {
    this._admin = admin;
    this.h = new ViewHelpers(admin);
    this.currentAdmin = currentAdmin;
  }
  async index() {
    return layoutTemplate(this._admin, this.currentAdmin, '');
  }
  async resourceAction({
    params
  }) {
    const {
      resourceId,
      actionName
    } = params;
    const href = this.h.resourceActionUrl({
      resourceId,
      actionName
    });
    return layoutTemplate(this._admin, this.currentAdmin, href);
  }
  async bulkAction({
    params,
    query
  }) {
    const {
      resourceId,
      actionName
    } = params;
    const recordIds = params.recordIds ?? query?.recordIds;
    if (!recordIds) {
      throw new Error('you have to give "recordIds" in the request parameters');
    }
    const arrayOfIds = recordIds.split(',');
    const href = this.h.bulkActionUrl({
      resourceId,
      actionName,
      recordIds: arrayOfIds
    });
    return layoutTemplate(this._admin, this.currentAdmin, href);
  }
  async resource({
    params
  }) {
    const {
      resourceId
    } = params;
    const href = this.h.resourceUrl({
      resourceId
    });
    return layoutTemplate(this._admin, this.currentAdmin, href);
  }
  async recordAction({
    params
  }) {
    const {
      resourceId,
      actionName,
      recordId
    } = params;
    if (!recordId) {
      throw new Error('you have to give "recordId" in the request parameters');
    }
    const href = this.h.recordActionUrl({
      resourceId,
      actionName,
      recordId
    });
    return layoutTemplate(this._admin, this.currentAdmin, href);
  }
  async page({
    params
  }) {
    const {
      pageName
    } = params;
    if (!pageName) {
      throw new Error('you have to give "pageName" in the request parameters');
    }
    const href = this.h.pageUrl(pageName);
    return layoutTemplate(this._admin, this.currentAdmin, href);
  }
  async bundleComponents() {
    return componentsBundler(this._admin);
  }
}