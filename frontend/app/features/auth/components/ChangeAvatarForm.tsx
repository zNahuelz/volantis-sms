type Props = {
  onBusyStart?: () => void;
  onBusyEnd?: () => void;
};
export default function ChangeAvatarForm({ onBusyStart, onBusyEnd }: Props) {
  return (
    <div>
      <h1>Change avatar form </h1>
    </div>
  );
}

/**
 * export default function ChangeEmailForm({ onBusyStart, onBusyEnd }: Props) {
  const handleSubmit = async () => {
    onBusyStart?.();
    try {
      await api.changeEmail(...);
    } finally {
      onBusyEnd?.();
    }
  };

  return (...);
}
 */
