import {ComponentFactoryResolver, ComponentRef, Directive, Input, OnInit, Type, ViewContainerRef} from '@angular/core';
import {FormGroup} from '@angular/forms';

import {FormButtonComponent} from '../form-button/form-button.component';
import {FormInputComponent} from '../form-input/form-input.component';
import {FormSelectComponent} from '../form-select/form-select.component';

import {Field} from '../../models/field.interface';
import {FieldConfig} from '../../models/field-config.interface';

const components: { [type: string]: Type<Field> } = {
  button: FormButtonComponent,
  input: FormInputComponent,
  select: FormSelectComponent
};

@Directive({
  selector: '[dynamicField]'
})
export class DynamicFieldDirective implements Field, OnInit {
  @Input()
  config: FieldConfig;

  @Input()
  group: FormGroup;

  component: ComponentRef<Field>;

  constructor(
    private resolver: ComponentFactoryResolver,
    private container: ViewContainerRef,
  ) {
  }


  ngOnInit() {
    if (!components[this.config.type]) {
      const supportedTypes = Object.keys(components).join(', ');
      throw new Error(
        `Trying to use an unsupported type (${this.config.type}).
        Supported types: ${supportedTypes}`
      );
    }
    const componentFactory = this.resolver.resolveComponentFactory<Field>(components[this.config.type]);
    this.component = this.container.createComponent(componentFactory);
    this.component.instance.config = this.config;
    this.component.instance.group = this.group;
    this.assignCSSClass();
  }

  private assignCSSClass(): void {
    if (this.config.className !== undefined) {
      this.component.location.nativeElement.classList.add(this.config.className);
    }
  }
}
