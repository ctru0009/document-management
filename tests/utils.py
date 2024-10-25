def dict_lists_equal(l1, l2):
    return set((frozenset(x) for x in l1)) == set((frozenset(x) for x in l2))
