import { IsNotEmpty, IsString, IsEnum, registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

function validarCNPJ(cnpj: string): boolean {
  const cleanCnpj = cnpj.replace(/\D/g, '');

  if (cleanCnpj.length !== 14 || /^(\d)\1+$/.test(cleanCnpj)) {
    return false;
  }

  let tamanho = cleanCnpj.length - 2;
  let numeros = cleanCnpj.substring(0, tamanho);
  const digitos = cleanCnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += Number(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== Number(digitos.charAt(0))) {
    return false;
  }

  tamanho = tamanho + 1;
  numeros = cleanCnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += Number(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== Number(digitos.charAt(1))) {
    return false;
  }

  return true;
}

export function IsCNPJ(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isCNPJ',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return typeof value === 'string' && validarCNPJ(value);
        },
        defaultMessage(args: ValidationArguments) {
          return 'O CNPJ informado não é um número válido ou está mal formatado.';
        },
      },
    });
  };
}

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome da empresa é obrigatório.' })
  name!: string;

  @IsString()
  @IsNotEmpty({ message: 'O CNPJ é obrigatório.' })
  @IsCNPJ() 
  cnpj!: string;

  @IsString()
  @IsNotEmpty({ message: 'O tipo da empresa é obrigatório.' })
  type!: string;

  @IsString()
  @IsNotEmpty({ message: 'O endereço é obrigatório.' })
  address!: string;
}