import { readFile } from 'fs/promises';
import { join, dirname } from 'node:path';
import { load } from 'js-yaml';
import { OpenAPIObject } from '@nestjs/swagger';

export async function loadApiDocumentation(): Promise<OpenAPIObject> {
  const apiDoc = await readFile(
    join(dirname(__dirname), 'doc', 'api.yaml'),
    'utf-8',
  );
  return load(apiDoc) as OpenAPIObject;
}
