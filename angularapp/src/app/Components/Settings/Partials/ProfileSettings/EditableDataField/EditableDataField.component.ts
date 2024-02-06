import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, signal } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { ImgButton, ImgButtonProp } from 'src/app/Components/General/ImgButton/ImgButton.component';
import { FormButton } from 'src/app/Components/General/FormButton/FormButton';
import { AbstractControl, AsyncValidatorFn, FormControl, FormControlStatus, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';


export interface ContentChangeEvent {
  src: EditableDataField,
  content: string
};

@Component({
  selector: 'EditableDataField',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIf, ImgButton, FormButton],
  templateUrl: './EditableDataField.component.html',
  styleUrls: ['./EditableDataField.component.css']
})
export class EditableDataField {
  
  @Input() content : string = "";
  @Input() type : string = "text";
  @Input() maxLength : number = 100;
  @Input() minLength : number = 0;
  @Input() fieldName : string = "Field";
  @Input() customValidator : AsyncValidatorFn = (control : AbstractControl) => {
    return new Promise<ValidationErrors | null>((resolve => {
      resolve(null);
    }));
  }
  @Output() Save : EventEmitter<string> = new EventEmitter<string>;
  @ViewChild("inputField") inputFild! : ElementRef;
  isEditable = signal(false);
  oldValue : string = "";
  @Input() errorMessage : string = "";
  @Input() successMessage : string = "";
  updated : boolean = false;

  showError = false;
  showSuccess = false;
  currentMessage : string = "";
  editButtonProps : ImgButtonProp = {
    Button: {},
    Img: {
      Src: "/assets/EditIcon.svg"
    }
  }

  editForm : FormGroup = new FormGroup({
    Content: new FormControl('', {updateOn: 'change'})
  });

  @ViewChild("saveFormButton") saveFormButton!: FormButton;


  formValidators : ValidatorFn[] = [];
  constructor(){
    this.oldValue = this.content;
    this.editForm.statusChanges.subscribe(this.OnStatusChange.bind(this));
  }

  OnStatusChange(status : FormControlStatus) {
    if (status === "INVALID") {
      const formControl = this.editForm.controls["Content"];
      if (formControl.errors) {
        if (formControl.errors["required"]) {
          this.ShowError(`${this.fieldName} cannot be empty.`);
        } 
        else if (formControl.errors["minlength"]) {
          this.ShowError(`${this.fieldName} requires at least ${this.minLength} characters.`);
        } 
        else if (formControl.errors["email"]) {
          this.ShowError(`${this.fieldName} must contain a valid email address.`);
        } 
        else if (formControl.errors["maxlength"]) {
          this.ShowError(`${this.fieldName} has a limit of ${this.maxLength} characters.`);
        }
        else if (formControl.errors["samevalue"]) {
          this.showError = false;
          this.showSuccess = false;
          if (this.saveFormButton)
            this.saveFormButton.SetActiveState(false);
        }
        else {
          this.ShowError(null);
        }
      }
    } else if (status === "VALID") {
      if (this.saveFormButton)
        this.ShowSuccess(null);
    }
  }

  AllowEdit() {
    this.oldValue = this.content;
    this.isEditable.set(true);
    this.editForm.get("Content")?.setValue(this.content);

    this.editForm.controls["Content"].addValidators(Validators.minLength(this.minLength));
    this.editForm.controls["Content"].addValidators(Validators.maxLength(this.maxLength));
    this.editForm.controls["Content"].addValidators(Validators.required);
    this.editForm.controls["Content"].addValidators(this.ValidateSameValue.bind(this));
    this.editForm.controls["Content"].addAsyncValidators(this.customValidator);

    if (this.type === "email")
    {
      this.editForm.controls["Content"].addValidators(Validators.email);
    }
    this.editForm.controls["Content"].updateValueAndValidity();
    setTimeout(() =>{
      if (this.inputFild)
        (this.inputFild.nativeElement as HTMLInputElement).focus();
    }, 1);
  }

  ConfirmEdit() {
    this.content = this.editForm.value.Content;
    this.isEditable.set(false);
    this.updated = true;
    setTimeout(() => {
      this.updated = false;
    }, 3000);
  }

  ValidateSameValue(control : AbstractControl) {
    if (control.value === this.oldValue)
      return {samevalue: true};

    return null;
  }

  CancelEdit() {
    this.content = this.oldValue;
    this.isEditable.set(false);
  }

  SaveChanges() {
    this.Save.emit(this.editForm.value.Content);
  }

  ShowError(message : string | null) {
    if (message)
      this.currentMessage = message;
    else
      this.currentMessage = this.errorMessage;
    this.showError = true;
    this.showSuccess = false;
    if (this.saveFormButton)
      this.saveFormButton.SetActiveState(false);
  }

  ShowSuccess(message : string | null) {
    if (message)
      this.currentMessage = message;
    else
      this.currentMessage = this.successMessage;
    this.showSuccess = true;
    this.showError = false;
    if (this.saveFormButton)
      this.saveFormButton.SetActiveState(true);
  }

  OnKeyUp(event : KeyboardEvent) {
    if (event.target === null)
      return;

    const input = event.target as HTMLInputElement;
    if (input.value === this.oldValue) {
      this.saveFormButton.SetActiveState(false);
      this.showError = false;
      this.showSuccess = false;
      return;
    }
  }
}
