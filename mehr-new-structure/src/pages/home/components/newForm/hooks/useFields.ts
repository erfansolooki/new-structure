import { useMemo } from 'react';
import type { DictType } from '@/context/LanguageContext';
import { usePersonnelControllerFindAll } from '@/libs/api/endpointsV1/personnel/personnel';
import { getPersonnelName } from '@/utils/getNameFromEntity';
import { VacationStatus } from '@/libs/api/models';
import { useVacationsContext } from '@/app/crm/vacations/contexts';

export const useFields = (
    dict: DictType,
) => {
  const { changePersonnel } = useVacationsContext();
  const { personnel } = useVacationsContext();
  const { common, crm } = dict;
  const  { personnelName, all, fromDate, toDate} = common
  const { urgency, status } = crm.vacations.table;

  const fields = useMemo(
    () => [
      {
        name: 'startDate' as const,
        type: 'date',
        label: `${fromDate} :`,
        componentProps: {
          className: '',

          wrapperClassName: '',
        },
      },
      {
        name: 'endDate' as const,
        type: 'date',
        label: `${toDate} :`,
        componentProps: {
          className: '',

          wrapperClassName: '',
        },
      },
      {
        name: 'requestedBy' as const,
        type: 'searchableSelectV3',
        label: personnelName,
        componentProps: {
          wrapperClassName: '',
          useFetchHook: usePersonnelControllerFindAll,
          onSelectionChange: changePersonnel,
          ...(personnel
            ? {
                initialValue: {
                  value: personnel.id,
                  label: getPersonnelName(personnel).fullName,
                },
              }
            : {}),
          dataField: 'data',
          filterField: 'search',
          mapOption: (item) => {
            const fullName = getPersonnelName(item).fullName;
            return {
              value: item.id,
              label: fullName,
            };
          },
        },
      },
      {
        name: 'isUrgent' as const,
        type: 'select',
        label: `${urgency.title} :`,
        componentProps: {
          options: [
            {
              label: all,
              value: '',
            },
            {
              label: urgency.items.normal,
              value: '0',
            },
            {
              label: urgency.items.urgent,
              value: '1',
            },
          ],
        },
      },
      {
        name: 'status' as const,
        type: 'select',
        label: `${status.title} :`,
        componentProps: {
          options: [
            {
              label: all,
              value: '',
            },
            {
              label: status.items.ACCEPTED,
              value: VacationStatus.ACCEPTED,
            },
            {
              label: status.items.CANCELED,
              value: VacationStatus.CANCELED,
            },
            {
              label: status.items.REJECTED,
              value: VacationStatus.REJECTED,
            },
            {
              label: status.items.WAITING,
              value: VacationStatus.WAITING,
            },
          ],
        },
      },
    ],
    [dict, changePersonnel, personnel]
  );

  return {
    fields,
  };
};