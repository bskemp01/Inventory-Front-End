/**
 * year-end-inventory-backend
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 1.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */

export interface SosZmmModel { 
    baseUnitOfMeasure?: string;
    material?: string;
    materialDescription?: string;
    salesDocument?: number;
    item?: number;
    storageLocation?: number;
    unrestricted?: number;
    supplyingPlant?: string;
    plant?: number;
    specialStock?: string;
    itemSD?: number;
    orderQuantity?: number;
    inQualityInsp?: number;
    blocked?: number;
    returns?: number;
    quantityReceived?: number;
    issuedQuantity?: number;
    purchasingDocument?: string;
    materialDocument?: string;
    materialDocItem?: number;
    deliveryDate?: string;
    loadScheduleNumber?: string;
    deliveryStatus?: string;
}